#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>

/**
 * main - copies content from one file to another
 * @argc: the number of arguments passed
 * @argv: an array of strings
 *
 * Return: always 0
 */
int main(int argc, char *argv[])
{
	int fd1, fd2;
	char ar1[10240];

	if ((strcmp(argv[0], "/home/vagrant/utility_functions/alias_files/cto") == 0) && (argc == 1))
	{
		printf("Copies the content of /vagrant/Downloads/cp.c to specified file\n"
				"Usage: cto [file_path]\n");
		return (0);
	}

	fd2 = open(argv[1], O_RDWR | O_CREAT, 0700);
	if (fd2 < 0)
	{
		printf("Error: argument 2: check that the file path is valid, and you have permissions to read/write\n");
	}

	fd1 = open("/vagrant/Downloads/cp.c", O_RDONLY);
	if (fd1 < 0)
	{
		printf("Error reading /vagrant/Downloads/cp.c\n");
	}

	read(fd1, ar1, 10240);
	write(fd2, ar1, strlen(ar1));

	close(fd1);
	close(fd2);

	return (0);
}
