#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu", (x)))

/**
 * handle_realloc2 - handles reallocation of memory to buff.
 * @buff: address of a single pointer previously allocated memory.
 * @old_bsize: the address of the variable holding buff's previous size.
 * @bsize: address of the variable representing the total size of buff.
 * @line: the buffer returned from getline3().
 *
 * Description: this subroutine is useful when you want to
 * perform updating of buffer size variables and reallocation as a unit.
 */
void handle_realloc2(char **buff, unsigned int *old_bsize,
		unsigned int *bsize, char *line __attribute__((unused)))
{
	*old_bsize = *bsize;
	*bsize += BUFSIZE;

	*buff = _realloc(*buff, *old_bsize, *bsize);
	if (!(*buff))
	{
		free_mallocd(NULL);
		perror("handle_realloc2");
		exit(EXIT_FAILURE);
	}
	mallocd_adds(NULL, "c", *buff);
}
