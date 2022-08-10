#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include "main.h"

/**
 * prints - prints the string s
 * @s: a pointer to the string to print
 *
 * Return: the number of bytes written/printed to STDOUT
 */
int prints(char *s)
{
	int  bytes_written;

	if (s == NULL)
	{
		return (0);
	}
	bytes_written = 0;
	bytes_written = write(1, s, _strlen(s));
	if (bytes_written == -1)
	{
		return (-1);
	}

	return (bytes_written);
}
